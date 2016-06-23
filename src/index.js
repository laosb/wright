const fileParsers = {
  // About parsers:
  // Parsers should just parse anything not in plain text to plain text, with no other markups
  // or parts meaningless in human language. for example, link URLs and code blocks. But parsers
  // need to use origin line numbers for each line in source file, for example, you skipped the
  // code block from line 2 to 6, the line number of the paragraph after the block should still
  // be 7, not 2.
  'plain'(fileContent, syntaxRules) {
    return {
      lines: fileContent.split('\n').map((line, arrIndex) => ({
        line,
        lineNum: arrIndex + 1,
      })),
      // Plain text parsing should have no syntax alerts as we even don't have syntax rules.
    };
  },
};

export default function wright(fileContent, fileType, rules) {
  //TODO: Better mechanism for rules in preset.
  // `rules` is an object contains all rules in it. Presets are not handled by this function.
  // There is no default rules in this program, so be sure to have it yourself! wright doesn't
  // handle rules itself, they are just passed to parsers and linters.
  if (!fileType) {
    fileType = 'plain';
  }
  
  const { syntaxRules: syntax, languageRules: language } = rules;
  const { lines, syntaxAlerts } = fileParsers[fileType](fileContent, syntaxRules);
  // Two kinds of alerts there:
  // language alerts: alerts of errors/warnings of (human) language itself by linters.
  // syntax alerts: alerts of errors/warnings of the syntax according to file type by parsers.
  // Both kinds of alerts can have rules defined.
  let languageAlerts = lint(lines, languageRules);
}
