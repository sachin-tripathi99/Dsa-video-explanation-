class Solution:
    def longestValidParentheses(self, s: str) -> int:
        best = 0
        o = c = 0
        for ch in s:                            # left to right
            if ch == "(":
                o += 1
            else:
                c += 1
            if o == c:
                best = max(best, 2 * c)
            elif c > o:
                o = c = 0
        o = c = 0
        for ch in reversed(s):                  # right to left
            if ch == "(":
                o += 1
            else:
                c += 1
            if o == c:
                best = max(best, 2 * o)
            elif o > c:
                o = c = 0
        return best
