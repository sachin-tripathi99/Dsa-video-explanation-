class Solution:
    def longestValidParentheses(self, s: str) -> int:
        best = 0
        for i in range(len(s)):
            bal = 0
            for j in range(i, len(s)):
                bal += 1 if s[j] == "(" else -1
                if bal < 0:
                    break
                if bal == 0:
                    best = max(best, j - i + 1)
        return best
