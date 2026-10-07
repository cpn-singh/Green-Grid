import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LiveMapConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "live_map"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send initial connection handshake confirmation
        await self.send(text_data=json.dumps({
            "type": "connected",
            "message": "Connected to Green Grid Live Map real-time telemetry feed"
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # Echo or broadcast incoming telemetry
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "map_event",
                    "payload": data
                }
            )
        except Exception:
            pass

    async def map_event(self, event):
        await self.send(text_data=json.dumps(event["payload"]))
