# AE Interview Lab

An interactive behavioral interview simulator created for the SDR-to-AE Readiness Program. Learners practice translating their SDR experience into credible evidence of Account Executive readiness.

## What learners can do

- Progress sequentially from Guided Practice to Mock Panel to Pressure Round
- Practice with an 18-question behavioral interview bank
- Respond by typing or recording audio locally
- Use STAR+L coaching and realistic interviewer follow-up questions
- Practice against preparation and response timers
- Predict performance before seeing the independently calculated evidence score
- Receive a weighted 100-point Evidence Strength Score from transparent, browser-based checks
- Review automatic personal-action and meaningful-results evidence gates
- Compare learner prediction with the evidence score during Mock Panel and Pressure Round
- Add optional manager, mentor, or peer validation during Pressure Round
- Receive answer-level coaching from Sparky, the Evidence Coach
- Celebrate strong demonstrated evidence with accessible, reduced-motion-aware confetti
- Copy or print a personal Evidence Challenge debrief

## Privacy and learner data

The simulator has no database, analytics, form submission, or external data connection.

- Typed responses are stored only in the learner's browser using local storage.
- Audio is recorded in the browser and is never uploaded by this site.
- Audio disappears when the page closes unless the learner downloads it.
- Clearing browser storage or selecting **Start over** removes saved typed practice.

The Evidence Challenge uses transparent pattern checks in the browser. Scoring rewards sufficient evidence across the complete interview rather than requiring every evidence element in every answer. It recognizes a broad range of natural action, judgment, result, and reflection language, but it does not verify whether a story is true or replace live interviewer feedback.

The GitHub Pages website itself should be treated as public unless your organization has configured private GitHub Pages access through GitHub Enterprise Cloud.

## Repository contents

```text
ae-interview-lab/
├── index.html
├── styles.css
├── app.js
├── .nojekyll
└── README.md
```

There is no build step and there are no package dependencies.

## Publish with the GitHub website

1. Create a new GitHub repository named `ae-interview-lab`.
2. Extract the ZIP package.
3. Upload all five files to the top level of the new repository. `index.html` must remain at the repository root.
4. Commit the uploaded files to the `main` branch.
5. Open the repository's **Settings**.
6. Select **Pages** under **Code, planning, and automation**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select the `main` branch and the `/ (root)` folder, then select **Save**.
9. When deployment finishes, select **Visit site**.

The default address will follow this pattern:

```text
https://YOUR-USERNAME.github.io/ae-interview-lab/
```

GitHub may take several minutes to publish the first version.

## Publish from the command line

Create an empty GitHub repository first. Then run these commands inside the extracted `ae-interview-lab` folder:

```bash
git init
git add .
git commit -m "Publish AE Interview Lab"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ae-interview-lab.git
git push -u origin main
```

After pushing, configure **Settings → Pages → Deploy from a branch → main → / (root)**.

## Updating the simulator

Replace the changed files in the repository and commit them to `main`. GitHub Pages will publish the updated version automatically.

## Browser requirements

The core simulator works in current desktop browsers. Audio practice requires:

- A browser that supports `MediaRecorder`
- Microphone permission
- HTTPS, which GitHub Pages provides automatically

If microphone access is unavailable, learners can use typed-response mode.

## Quality checks completed

- JavaScript syntax validation
- Question-bank and panel-distribution checks
- Rubric-weight validation
- Readiness-gate validation
- Required interaction and element-ID checks
- Local-data and external-script checks
- GitHub project-path asset loading check
