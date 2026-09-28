class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<bool> taken(numCourses, false);
        vector<int> order;
        for (int k = 0; k < numCourses; k++) {
            int pick = -1;
            for (int c = 0; c < numCourses && pick < 0; c++) {   // rescan every course
                if (taken[c]) continue;
                bool ready = true;
                for (auto& p : prerequisites) if (p[0] == c && !taken[p[1]]) { ready = false; break; }
                if (ready) pick = c;
            }
            if (pick < 0) return {};                        // everything left waits on a cycle
            taken[pick] = true;
            order.push_back(pick);
        }
        return order;
    }
};
