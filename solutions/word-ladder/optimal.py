from collections import deque
from string import ascii_lowercase

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        words = set(wordList)
        if endWord not in words:
            return 0
        seen, q, d = {beginWord}, deque([beginWord]), 1
        while q:
            for _ in range(len(q)):
                w = q.popleft()
                if w == endWord:
                    return d
                for i in range(len(w)):
                    for ch in ascii_lowercase:  # change letter i
                        x = w[:i] + ch + w[i + 1:]
                        if x in words and x not in seen:
                            seen.add(x)
                            q.append(x)
            d += 1
        return 0
