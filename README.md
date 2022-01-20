# Let's build a Wordle!

This is the code base which we build togther in [my twitch stream](https://www.twitch.tv/d40b_codes).

> This German Wordle is live on [wortle.schmonz.club](https://wortle.schmonz.club)

#### To get this code started do the following:

1. check out the repo
2. `yarn install`
3. `yarn dev`

#### To use your own dictionary:

1. get a file containing one word per line
2. run `node scripts/extract-words.mjs [path-to-your-file] > src/word-lists/[name].json`
3. import your `json` file in the `App.jsx`

### Next steps:

- [ ] style with vanilla-extract (dark & light theme!)
- [ ] proper game loop
- [ ] animations (and sounds?)
- [ ] localization (i.e. support for different languages and keyboard layouts)
