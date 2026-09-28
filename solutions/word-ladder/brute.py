from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList:
            return 0
        seen, q, d = {beginWord}, deque([beginWord]), 1
        while q:
            for _ in range(len(q)):
                w = q.popleft()
                if w == endWord:
                    return d
                for x in wordList:              # compare with every word
                    if x not in seen and sum(a != b for a, b in zip(w, x)) == 1:
                        seen.add(x)
                        q.append(x)
            d += 1
        return 0
