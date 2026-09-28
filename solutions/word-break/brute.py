class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)

        def can(start):
            if start == len(s):
                return True
            return any(s[start:end] in words and can(end)    # try every first word
                       for end in range(start + 1, len(s) + 1))

        return can(0)
