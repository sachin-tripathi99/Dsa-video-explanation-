class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        taken = [False] * numCourses
        order = []
        for _ in range(numCourses):
            pick = next((c for c in range(numCourses)                 # rescan every course
                         if not taken[c] and all(taken[b] for a, b in prerequisites if a == c)), -1)
            if pick < 0:
                return []                       # everything left waits on a cycle
            taken[pick] = True
            order.append(pick)
        return order
