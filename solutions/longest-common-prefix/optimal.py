class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        first = strs[0]
        for i, c in enumerate(first):
            for w in strs:
                if i == len(w) or w[i] != c:   # column mismatch
                    return first[:i]
        return first
