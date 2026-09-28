class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> res;
        for (int i = 1; i <= (int)searchWord.size(); i++) {
            string p = searchWord.substr(0, i);
            vector<string> cur;
            for (auto& s : products) {                      // rescan every product
                if (s.compare(0, p.size(), p) == 0) cur.push_back(s);
                if (cur.size() == 3) break;
            }
            res.push_back(cur);
        }
        return res;
    }
};
