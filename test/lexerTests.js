var should = require("should");
var parser = require('./main');

describe('Test lexer', function() {
  describe('initial state', function() {
    var ast = parser.parseCode([
      '<? echo $a; ?>',
      '<?= $a ?>',
      '<% echo $b; %>',
      '<%= $b %>'
    ].join('\n'), {
      lexer: {
        short_tags: true,
        asp_tags: true
      }
    });
    it('parse short tag', function() {
      ast.children[0].kind.should.be.exactly('echo');
      ast.children[0].arguments[0].kind.should.be.exactly('variable');
      ast.children[0].arguments[0].name.should.be.exactly('a');
    });
    it('parse short echo', function() {
      ast.children[1].kind.should.be.exactly('echo');
      ast.children[1].arguments[0].kind.should.be.exactly('variable');
      ast.children[1].arguments[0].name.should.be.exactly('a');
    });
    it('parse asp tag', function() {
      ast.children[2].kind.should.be.exactly('echo');
      ast.children[2].arguments[0].kind.should.be.exactly('variable');
      ast.children[2].arguments[0].name.should.be.exactly('b');
    });
    it('parse asp echo tag', function() {
      ast.children[3].kind.should.be.exactly('echo');
      ast.children[3].arguments[0].kind.should.be.exactly('variable');
      ast.children[3].arguments[0].name.should.be.exactly('b');
    });
  });

  describe('test comments', function() {
    it('should work ^^', function() {
      var ast = parser.parseCode([
        '<?php',
        ' // simple comment ?>',
        '<%',
        ' // another line %>',
        '<?',
        ' /**/ ?>',
        '<?php // last comment'
      ].join('\r'), {
        lexer: {
          short_tags: true,
          asp_tags: true,
          debug: false
        },
        parser: {
          extractDoc: true,
          debug: false
        }
      });
      // @fixme
      ast.children[0].kind.should.be.exactly('doc');
      // console.log(ast.children);
    });
  });
  it('test tokens', function() {
    var tokens = parser.tokenGetAll('<?php\necho $var;');
    // test type
    tokens[0][0].should.be.exactly('T_OPEN_TAG');
    tokens[1][0].should.be.exactly('T_ECHO');
    tokens[2][0].should.be.exactly('T_WHITESPACE');
    tokens[3][0].should.be.exactly('T_VARIABLE');
    tokens[4].should.be.exactly(';');
    // test contents
    tokens[0][1].should.be.exactly('<?php\n');
    tokens[1][1].should.be.exactly('echo');
    tokens[2][1].should.be.exactly(' ');
    tokens[3][1].should.be.exactly('$var');
    // test lines
    tokens[0][2].should.be.exactly(1);
    tokens[1][2].should.be.exactly(2);
    tokens[2][2].should.be.exactly(2);
    tokens[3][2].should.be.exactly(2);
  });
});
