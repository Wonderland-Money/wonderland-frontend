# [Trident Frontend](https://tridentdao.finance/)
This is the front-end repo for Trident. 

##  🔧 Setting up Local Development

Required: 
- [Node v14](https://nodejs.org/download/release/latest-v14.x/)  
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) 
- [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/0xMaaz/trident-frontend.git
cd trident-frontend
yarn
yarn start
```

The site is now running at `http://localhost:3000`! You will be greeted by the landing page.


To access the web app, create a a custom domain that contains `app` to point to localhost:
```
echo "127.0.0.1 app.trident.localhost" | sudo tee -a /etc/hosts
```
The web app can now be accessed at `http://app.trident.localhost:3000`.

Open the source code and start editing!

**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch. 

## 👏🏽 Contributing Guidelines 

*__NOTE__*: For big changes associated with feature releases/milestones, they will be merged onto the `develop` branch for more thorough QA before a final merge to `master`
