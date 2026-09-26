class Solution {
    vector<int> parent;

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        int n = accounts.size();
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0);
        unordered_map<string, int> owner;                  // email → first account with it
        for (int i = 0; i < n; i++)
            for (size_t k = 1; k < accounts[i].size(); k++) {
                auto [it, fresh] = owner.emplace(accounts[i][k], i);
                if (!fresh) parent[find(i)] = find(it->second);
            }
        map<int, vector<string>> groups;
        for (auto& [e, i] : owner) groups[find(i)].push_back(e);
        vector<vector<string>> out;
        for (auto& [r, es] : groups) {
            sort(es.begin(), es.end());
            vector<string> row = {accounts[r][0]};
            row.insert(row.end(), es.begin(), es.end());
            out.push_back(row);
        }
        return out;
    }
};
