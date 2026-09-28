class Solution {
public:
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        vector<bool> seen(rooms.size(), false);
        vector<int> st{0};
        seen[0] = true;
        size_t count = 1;
        while (!st.empty()) {
            int x = st.back(); st.pop_back();
            for (int k : rooms[x])
                if (!seen[k]) { seen[k] = true; count++; st.push_back(k); }   // new room
        }
        return count == rooms.size();
    }
};
