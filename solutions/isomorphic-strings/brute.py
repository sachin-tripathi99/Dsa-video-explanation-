class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        n = len(s)
        for i in range(n):
            for j in range(i + 1, n):
                if (s[i] == s[j]) != (t[i] == t[j]):
                    return False
        return True
