import sys
import requests
from bs4 import BeautifulSoup

def get_nptel_scores(email):
    try:
        # Fake NPTEL login (Replace with real NPTEL API if available)
        login_url = "https://nptel.ac.in/login"
        scores_url = f"https://nptel.ac.in/user-scores/{email}"

        # Simulate login
        session = requests.Session()
        login_payload = {"email": email, "password": "dummy_password"}
        session.post(login_url, data=login_payload)

        # Fetch scores
        response = session.get(scores_url)
        if response.status_code != 200:
            return "❌ Failed to fetch scores"

        # Parse the HTML response (This depends on the NPTEL website structure)
        soup = BeautifulSoup(response.text, "html.parser")
        scores = soup.find("div", class_="score-data").text.strip()

        return f"✅ NPTEL Score for {email}: {scores}"
    except Exception as e:
        return f"❌ Error fetching scores: {str(e)}"

if __name__ == "__main__":
    email = sys.argv[1]  # Get email from Node.js
    print(get_nptel_scores(email))  # Print result for Node.js to capture
