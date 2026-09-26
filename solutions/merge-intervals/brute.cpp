class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        vector<vector<int>> v = intervals;
        bool changed = true;
        while (changed) {
            changed = false;
            for (size_t i = 0; i < v.size() && !changed; i++)
                for (size_t j = i + 1; j < v.size(); j++)
                    if (v[i][0] <= v[j][1] && v[j][0] <= v[i][1]) {   // overlap → union
                        v[i] = {min(v[i][0], v[j][0]), max(v[i][1], v[j][1])};
                        v.erase(v.begin() + j);
                        changed = true;
                        break;
                    }
        }
        sort(v.begin(), v.end());
        return v;
    }
};
