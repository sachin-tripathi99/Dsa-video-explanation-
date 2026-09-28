class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:
        n = len(s)
        for length in range(1, n // 2 + 1):
            if n % length:
                continue                        # the block must divide n
            if all(s[i] == s[i - length] for i in range(length, n)):
                return True
        return False
