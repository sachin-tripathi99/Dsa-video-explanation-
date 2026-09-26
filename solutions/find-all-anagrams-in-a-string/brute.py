class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        k = len(p)
        want = sorted(p)
        return [i for i in range(len(s) - k + 1) if sorted(s[i:i + k]) == want]
