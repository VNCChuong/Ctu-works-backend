import pymongo

# Establish connection to MongoDB
client = pymongo.MongoClient("mongodb+srv://admin:admin@cluster0.dhcu79l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["LVTN-CtuWorks"]  # Replace with your database name

users = db["users"]
search_histories = db["searchhistories"]
jobposts = db["jobposts"]

def recommend_jobs(user_id):
  """
  Recommends jobs based on user information and search history.

  Args:
    user_id: The ID of the user.

  Returns:
    A list of relevant job documents.
  """

  # 1. Fetch user data
  user = users.find_one({"_id": user_id})

  if not user:
    return []  # Handle case where user is not found

  # 2. Fetch search history
  search_history = search_histories.find({"userId": user_id})

  # 3. Analyze user data and search history (Extract keywords, skills, location preferences, etc.)
  # ... your logic here to process user data and search history ...

  # 4. Define search criteria for job recommendations based on the analysis
  search_criteria = {
      # Example:
      "location": user.get("location"),
      "skills": {"$in": extracted_skills}, 
      # ... add more criteria based on your analysis ...
  }

  # 5. Query the "jobposts" collection for matching jobs
  recommended_jobs = jobposts.find(search_criteria)

  return list(recommended_jobs)

# Example usage:
user_id_to_search = "your_user_id"
recommendations = recommend_jobs(user_id_to_search)

print(recommendations)