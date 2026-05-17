.PHONY: api-up api-down api-logs

api-up:
	docker compose -f ~/workspace/ord-api/docker-compose.yaml up -d

api-down:
	docker compose -f ~/workspace/ord-api/docker-compose.yaml down

api-logs:
	docker compose -f ~/workspace/ord-api/docker-compose.yaml logs -f
