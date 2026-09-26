class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        k = len(s1)
        want = sorted(s1)
        return any(sorted(s2[i:i + k]) == want for i in range(len(s2) - k + 1))
