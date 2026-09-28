class Solution:
    def minInsertions(self, s: str) -> int:
        def ins(i, j):
            if i >= j:
                return 0
            if s[i] == s[j]:
                return ins(i + 1, j - 1)        # ends already mirror
            return 1 + min(ins(i + 1, j), ins(i, j - 1))   # mirror one end
        return ins(0, len(s) - 1)
