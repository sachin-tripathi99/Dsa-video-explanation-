class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        def ed(i, j):
            if i == 0:
                return j                        # insert the rest
            if j == 0:
                return i                        # delete the rest
            if word1[i - 1] == word2[j - 1]:
                return ed(i - 1, j - 1)
            return 1 + min(ed(i - 1, j - 1), ed(i - 1, j), ed(i, j - 1))   # replace / delete / insert
        return ed(len(word1), len(word2))
