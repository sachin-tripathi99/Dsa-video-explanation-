from collections import deque

class Solution:
    def timeRequiredToBuy(self, tickets: List[int], k: int) -> int:
        q = deque((i, t) for i, t in enumerate(tickets))
        time = 0
        while True:
            i, left = q.popleft()
            time += 1
            left -= 1                                    # buy one ticket
            if i == k and left == 0:
                return time
            if left > 0:
                q.append((i, left))                      # back of the line
