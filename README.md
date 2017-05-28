**Estructor - a stack to enable in-browser cross platform development**

Based on [Este](https://github.com/msand/este), [Structor](https://github.com/ipselon/structor) and [React Native for Web](https://github.com/necolas/react-native-web/)

**Requirements**

Install [Node.js](https://nodejs.org/en/) and [React Native](https://facebook.github.io/react-native/docs/getting-started.html) first

If you do not have lerna or gulp installed make sure to install them globally:
`npm install -g lerna gulp`

**Setup**
```
git clone https://github.com/msand/estructor
cd estructor
lerna bootstrap
```
Read /packages/este/README.md

**Development** 

web:
```
cd packages
cd este
gulp
```

android: ```gulp android```

ios: `gulp ios`

To run structor
```
cd packages
cd structor-starter
npm run structor
```

Other commands in:

/packages/este/gulp/

/packages/este/package.json

/packages/structor-starter/package.json

**Stack**

Everything in vanilla Este plus integration with React Native for Web, Apollo and CodePush