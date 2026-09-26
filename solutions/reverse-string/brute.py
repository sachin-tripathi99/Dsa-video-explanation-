class Solution:
    def reverseString(self, s: List[str]) -> None:
        copy = [s[i] for i in range(len(s) - 1, -1, -1)]
        for i in range(len(s)):
            s[i] = copy[i]
