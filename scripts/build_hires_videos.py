import cv2
import numpy as np
import os
import time

media_dir = os.path.abspath('frontend/public/energy-media')
dist_dir = os.path.abspath('frontend/dist/energy-media')

sources = [
    ('solar.jpg', 'solar.mp4', 'solar'),
    ('wind.jpg', 'wind.mp4', 'wind'),
    ('large-hydro.jpg', 'hydro.mp4', 'water'),
    ('pumped-hydro.jpg', 'pumped-hydro.mp4', 'water'),
    ('bess.jpg', 'bess.mp4', 'energy'),
    ('small-hydro.jpg', 'small-hydro.mp4', 'water'),
    ('biomass.jpg', 'biomass.mp4', 'fire'),
    ('green-hydrogen.jpg', 'green-hydrogen.mp4', 'hydrogen'),
    ('geothermal.jpg', 'geothermal.mp4', 'steam'),
]

target_w, target_h = 1920, 1080
fps = 30
total_frames = 150  # 5.0s seamless loop

fourcc = cv2.VideoWriter_fourcc(*'avc1')

print(f"Generating {len(sources)} pristine Full-HD 1080p ({target_w}x{target_h}) videos...")

for in_img_name, out_video_name, p_type in sources:
    t0 = time.time()
    in_path = os.path.join(media_dir, in_img_name)
    out_path = os.path.join(media_dir, out_video_name)

    img = cv2.imread(in_path)
    if img is None:
        print(f"Error: {in_path} not found!")
        continue

    # 1. High-fidelity Lanczos4 upscale with motion margin (1.10x)
    base_img = cv2.resize(img, (int(target_w * 1.10), int(target_h * 1.10)), interpolation=cv2.INTER_LANCZOS4)

    # 2. High-frequency unsharp mask to restore micro-details (panels, blades, rocks, water)
    blurred = cv2.GaussianBlur(base_img, (0, 0), 1.5)
    base_img = cv2.addWeighted(base_img, 1.28, blurred, -0.28, 0)

    # 3. Dynamic color grading: rich blacks, punchy highlights, cinematic saturation
    hsv = cv2.cvtColor(base_img, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.10, 0, 255)  # +10% vibrance
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.04, 0, 255)  # +4% exposure
    base_img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    bh, bw, _ = base_img.shape

    # Atmospheric particles tailored to each energy source
    num_particles = 55
    np.random.seed(abs(hash(out_video_name)) % 100000)
    px = np.random.uniform(0, target_w, num_particles)
    py = np.random.uniform(0, target_h, num_particles)
    pspeed_y = np.random.uniform(0.6, 2.2, num_particles)
    psize = np.random.uniform(1.2, 3.8, num_particles)

    writer = cv2.VideoWriter(out_path, fourcc, fps, (target_w, target_h))

    for f in range(total_frames):
        phase = (f / total_frames) * 2 * np.pi
        loop_curve = np.sin((f / total_frames) * np.pi)

        # Smooth camera breathing zoom & subtle pan
        zoom = 1.0 + 0.035 * loop_curve
        curr_w = int(target_w * zoom)
        curr_h = int(target_h * zoom)

        offset_x = int((bw - curr_w) / 2 + 14 * np.sin(phase))
        offset_y = int((bh - curr_h) / 2 + 8 * np.cos(phase * 0.5))
        offset_x = max(0, min(offset_x, bw - curr_w))
        offset_y = max(0, min(offset_y, bh - curr_h))

        cropped = base_img[offset_y:offset_y + curr_h, offset_x:offset_x + curr_w]
        frame = cv2.resize(cropped, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

        # Subtle sunlight / ambient light pulse
        light_boost = 1.0 + 0.03 * np.sin(phase)
        frame = np.clip(frame.astype(np.float32) * light_boost, 0, 255).astype(np.uint8)

        # Render bokeh particles
        p_canvas = np.zeros_like(frame)
        for p in range(num_particles):
            if p_type in ['steam', 'fire', 'hydrogen']:
                c_py = (py[p] - f * pspeed_y[p] * 1.8) % target_h
            elif p_type == 'wind':
                c_py = (py[p] + 3 * np.sin(phase + p)) % target_h
            else:
                c_py = (py[p] + f * pspeed_y[p] * 0.8) % target_h

            if p_type == 'wind':
                c_px = (px[p] + f * 3.5) % target_w  # horizontal wind drift
            else:
                c_px = (px[p] + 10 * np.sin(phase + p)) % target_w

            r = int(psize[p])
            if p_type in ['energy', 'hydrogen']:
                col = (210, 255, 120)
            elif p_type == 'fire':
                col = (60, 190, 255)
            elif p_type in ['steam', 'water', 'wind']:
                col = (255, 240, 210)
            else:
                col = (190, 255, 190)

            cv2.circle(p_canvas, (int(c_px), int(c_py)), r, col, -1)
            cv2.circle(p_canvas, (int(c_px), int(c_py)), r * 2, col, 1)

        p_canvas = cv2.GaussianBlur(p_canvas, (7, 7), 0)
        p_alpha = 0.20 * (0.7 + 0.3 * np.sin(phase))
        frame = cv2.addWeighted(frame, 1.0, p_canvas, p_alpha, 0)

        writer.write(frame)

    writer.release()
    file_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f"[OK] {out_video_name} (1080p, 5s loop): {file_mb:.2f} MB in {time.time()-t0:.1f}s")

    # Mirror to dist/energy-media if it exists
    if os.path.exists(dist_dir):
        import shutil
        shutil.copy2(out_path, os.path.join(dist_dir, out_video_name))

print("All 9 Full-HD 1080p background videos successfully generated and deployed!")
