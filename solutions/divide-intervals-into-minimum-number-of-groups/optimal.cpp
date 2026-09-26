class Solution {
public:
    int minGroups(vector<vector<int>>& intervals) {
        vector<int> st, en;
        for (auto& iv : intervals) { st.push_back(iv[0]); en.push_back(iv[1]); }
        sort(st.begin(), st.end());
        sort(en.begin(), en.end());
        int j = 0, groups = 0;
        for (int s : st) {
            if (s > en[j]) j++;                         // an interval finished: reuse its group
            else groups++;
        }
        return groups;
    }
};
