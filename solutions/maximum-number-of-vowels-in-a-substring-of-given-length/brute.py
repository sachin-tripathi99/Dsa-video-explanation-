class Solution:
    def maxVowels(self, s: str, k: int) -> int:
        return max(sum(c in "aeiou" for c in s[i:i + k]) for i in range(len(s) - k + 1))
