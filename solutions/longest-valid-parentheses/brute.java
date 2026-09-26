class Solution {
    public int longestValidParentheses(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            int bal = 0;
            for (int j = i; j < s.length(); j++) {
                bal += s.charAt(j) == '(' ? 1 : -1;
                if (bal < 0) break;
                if (bal == 0) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}
