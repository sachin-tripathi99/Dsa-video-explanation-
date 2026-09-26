class Solution {
public:
    int longestValidParentheses(string s) {
        int best = 0, open = 0, close = 0;
        for (char ch : s) {                              // left to right
            if (ch == '(') open++; else close++;
            if (open == close) best = max(best, 2 * close);
            else if (close > open) open = close = 0;
        }
        open = close = 0;
        for (int i = (int)s.size() - 1; i >= 0; i--) {   // right to left
            if (s[i] == '(') open++; else close++;
            if (open == close) best = max(best, 2 * open);
            else if (open > close) open = close = 0;
        }
        return best;
    }
};
