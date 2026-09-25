class Solution {
public:
    bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
        vector<bool> reached(n, false);
        reached[source] = true;
        bool changed = true;
        while (changed) {                       // at most n sweeps
            changed = false;
            for (auto& e : edges) {
                if (reached[e[0]] != reached[e[1]]) {
                    reached[e[0]] = reached[e[1]] = true;
                    changed = true;
                }
            }
        }
        return reached[destination];
    }
};
