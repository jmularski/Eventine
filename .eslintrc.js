module.exports = {
    'extends': 'google',
    'rules': {
        'func-names': 0,
        'linebreak-style': ['error', process.env.NODE_ENV === 'prod' ? 'unix' : 'windows' ],
        'keyword-spacing': [2, { 'overrides': {
            'if': { 'before': true, 'after': false },
            'catch': { 'before': true, 'after': false },
        }}],
        'object-curly-spacing': 0,
        'arrow-parens': 0,
        'new-cap': 0,
    },
    'parserOptions': {
        'ecmaVersion': 9
    },
};