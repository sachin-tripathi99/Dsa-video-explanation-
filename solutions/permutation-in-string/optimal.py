class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        k = len(s1)
        if k > len(s2):
            return False
        need = [0] * 26
        have = [0] * 26
        for c in s1:
            need[ord(c) - 97] += 1
        for r, c in enumerate(s2):
            have[ord(c) - 97] += 1              # one in
            if r >= k:
                have[ord(s2[r - k]) - 97] -= 1  # one out
            if r >= k - 1 and have == need:
                return True
        return False
