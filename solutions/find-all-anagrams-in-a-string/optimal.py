class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        k, n = len(p), len(s)
        if k > n:
            return []
        diff = [0] * 26                         # window count − p count, per letter
        for c in p:
            diff[ord(c) - 97] -= 1
        matches = sum(d == 0 for d in diff)

        def change(c, delta):
            nonlocal matches
            matches -= diff[c] == 0
            diff[c] += delta
            matches += diff[c] == 0

        out = []
        for r in range(n):
            change(ord(s[r]) - 97, 1)
            if r >= k:
                change(ord(s[r - k]) - 97, -1)
            if r >= k - 1 and matches == 26:
                out.append(r - k + 1)
        return out
