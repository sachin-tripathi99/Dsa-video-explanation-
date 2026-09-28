class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False

        def ok(i, j):
            if i == len(s1) and j == len(s2):
                return True
            want = s3[i + j]                    # position in s3 is i + j
            return (i < len(s1) and s1[i] == want and ok(i + 1, j)) or \
                   (j < len(s2) and s2[j] == want and ok(i, j + 1))

        return ok(0, 0)
