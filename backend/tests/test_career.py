import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_career_portfolio_endpoint(client: AsyncClient):
    resp = await client.get(f"{settings.API_V1_STR}/career/portfolio")
    assert resp.status_code == 200
    data = resp.json()
    assert data["candidate_name"] == "RISHI SHARMA"
    assert data["career_readiness_score"] == 84
    assert data["verified_skills_count"] == 17
    assert data["passport_hash"] == "0xGENOVA9942FA71C0B819E752D8A4"
    assert len(data["skills"]) >= 5

@pytest.mark.asyncio
async def test_career_copilot_data_analyst_query(client: AsyncClient):
    payload = {"query": "What should I learn to become a data analyst?"}
    resp = await client.post(f"{settings.API_V1_STR}/career/copilot/query", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["student_name"] == "Rishi Sharma"
    assert data["response_type"] == "role_gap_roadmap"
    assert data["readiness_score"] == 64
    assert "target_role" in data["data_payload"]

@pytest.mark.asyncio
async def test_career_copilot_internship_audit(client: AsyncClient):
    payload = {"query": "Why am I not ready for this internship?"}
    resp = await client.post(f"{settings.API_V1_STR}/career/copilot/query", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["response_type"] == "internship_readiness_audit"
    assert data["readiness_score"] == 88

@pytest.mark.asyncio
async def test_career_verify_claim_protocol(client: AsyncClient):
    payload = {
        "claim_type": "Certificate",
        "title": "AWS Solutions Architect Associate",
        "issuer_or_platform": "Amazon Web Services",
        "category": "Cloud Infrastructure",
        "details": "Credential ID AWS-SAA-99214"
    }
    resp = await client.post(f"{settings.API_V1_STR}/career/verify-claim", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "VERIFIED_AND_PUBLISHED"
    assert "0xCRT-" in data["verification_hash"]
    assert data["badge_seal"] == "GENOVA-SEALED-CERT"

@pytest.mark.asyncio
async def test_career_skill_gap_heatmap(client: AsyncClient):
    resp = await client.get(f"{settings.API_V1_STR}/career/skill-gap-heatmap")
    assert resp.status_code == 200
    data = resp.json()
    assert "DSA + Cloud" in data["recommendation"]
    assert len(data["matrix"]) >= 4
