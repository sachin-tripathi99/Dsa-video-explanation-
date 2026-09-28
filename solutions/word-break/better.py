from functools import cache

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)

        @cache                                  # each suffix solved once
        def can(start):
            if start == len(s):
                return True
            return any(s[start:end] in words and can(end) for end in range(start + 1, len(s) + 1))

        return can(0)
