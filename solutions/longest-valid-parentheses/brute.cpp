class Solution {
public:
    int longestValidParentheses(string s) {
        int best = 0, n = s.size();
        for (int i = 0; i < n; i++) {
            int bal = 0;
            for (int j = i; j < n; j++) {
                bal += s[j] == '(' ? 1 : -1;
                if (bal < 0) break;
                if (bal == 0) best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
