class Solution {
public:
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        int n = rooms.size();
        vector<bool> open(n, false);
        open[0] = true;
        bool changed = true;
        while (changed) {                                   // sweep until nothing new opens
            changed = false;
            for (int i = 0; i < n; i++) {
                if (!open[i]) continue;
                for (int k : rooms[i]) if (!open[k]) { open[k] = true; changed = true; }
            }
        }
        for (bool b : open) if (!b) return false;
        return true;
    }
};
