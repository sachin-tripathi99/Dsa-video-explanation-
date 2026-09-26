class Solution {
    private static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    private final List<String> out = new ArrayList<>();

    public List<String> letterCombinations(String digits) {
        if (!digits.isEmpty()) go(digits, 0, new StringBuilder());
        return out;
    }

    private void go(String digits, int i, StringBuilder path) {
        if (i == digits.length()) { out.add(path.toString()); return; }
        for (char ch : KEYS[digits.charAt(i) - '0'].toCharArray()) {
            path.append(ch);                                // choose
            go(digits, i + 1, path);                        // explore
            path.deleteCharAt(path.length() - 1);           // un-choose
        }
    }
}
