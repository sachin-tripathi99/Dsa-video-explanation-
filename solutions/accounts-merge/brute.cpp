class Solution {
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        vector<string> names;
        vector<set<string>> sets;
        for (auto& a : accounts) {
            names.push_back(a[0]);
            sets.emplace_back(a.begin() + 1, a.end());
        }
        bool merged = true;
        while (merged) {
            merged = false;
            for (size_t i = 0; i < sets.size() && !merged; i++)
                for (size_t j = i + 1; j < sets.size() && !merged; j++) {
                    bool share = false;
                    for (auto& e : sets[j]) if (sets[i].count(e)) { share = true; break; }
                    if (share) {
                        sets[i].insert(sets[j].begin(), sets[j].end());
                        sets.erase(sets.begin() + j);
                        names.erase(names.begin() + j);
                        merged = true;                   // start over after every merge
                    }
                }
        }
        vector<vector<string>> out;
        for (size_t i = 0; i < sets.size(); i++) {
            vector<string> row = {names[i]};
            row.insert(row.end(), sets[i].begin(), sets[i].end());   // std::set is already sorted
            out.push_back(row);
        }
        return out;
    }
};
