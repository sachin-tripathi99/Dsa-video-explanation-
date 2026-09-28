class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        opened = {0}
        changed = True
        while changed:                          # sweep until nothing new opens
            changed = False
            for i in list(opened):
                for k in rooms[i]:
                    if k not in opened:
                        opened.add(k)
                        changed = True
        return len(opened) == len(rooms)
