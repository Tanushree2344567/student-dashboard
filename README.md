Student Dashboard: Cognitive Skills & Performance Analysis
Project Description

This project is a Student Performance Dashboard that analyzes cognitive skills and predicts assessment scores. It visualizes data, clusters students into learning personas, and provides insights for educators.

Dataset

The synthetic dataset contains the following fields:

Field	Description
student_id	Unique ID for each student
name	Student’s name
class	Student’s class/grade
comprehension	Comprehension skill score
attention	Attention skill score
focus	Focus skill score
retention	Retention skill score
assessment_score	Actual assessment score
engagement_time	Time spent engaging with content
Machine Learning

Prediction: Linear Regression model predicts assessment_score based on cognitive skills.

Clustering: KMeans clusters students into learning personas based on their cognitive skills.

Dashboard Features (Next.js)

Table: Shows Name, Actual Score, Predicted Score, and Cluster

Searchable and sortable

Charts:

Bar Chart: Actual vs Predicted Scores

Scatter Chart: Attention vs Score

Radar Chart: Individual student profile

Cluster Bar Chart: Counts of students in each learning persona

Insights Section:

Average scores

Top/Lowest predicted scores

Cluster counts

Setup Instructions

Clone the repository:

git clone https://github.com/Tanushree2344567/student-dashboard.git


Navigate to the project folder:

cd student-dashboard/dashboard


Install dependencies:

npm install


Run the project locally:

npm run dev


Open your browser at http://localhost:3000
