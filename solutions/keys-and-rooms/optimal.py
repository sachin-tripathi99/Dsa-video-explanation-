class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        seen, st = {0}, [0]
        while st:
            for k in rooms[st.pop()]:
                if k not in seen:
                    seen.add(k)                 # new room
                    st.append(k)
        return len(seen) == len(rooms)
