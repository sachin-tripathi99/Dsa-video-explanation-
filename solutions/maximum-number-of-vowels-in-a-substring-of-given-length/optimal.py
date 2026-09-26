class Solution:
    def maxVowels(self, s: str, k: int) -> int:
        vowels = set("aeiou")
        count = best = 0
        for r, c in enumerate(s):
            if c in vowels:
                count += 1                      # one in
            if r >= k and s[r - k] in vowels:
                count -= 1                      # one out
            if r >= k - 1:
                best = max(best, count)
        return best
