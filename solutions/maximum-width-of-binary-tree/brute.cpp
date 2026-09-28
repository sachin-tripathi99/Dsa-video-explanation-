class Solution {
public:
    int widthOfBinaryTree(TreeNode* root) {
        vector<TreeNode*> level{root};
        int best = 0;
        while (true) {
            int first = -1, last = -1;
            for (int i = 0; i < (int)level.size(); i++) if (level[i]) { if (first < 0) first = i; last = i; }
            if (first < 0) return best;                     // no real nodes left
            best = max(best, last - first + 1);
            vector<TreeNode*> next;
            for (int i = first; i <= last; i++) {           // placeholders keep the gaps
                TreeNode* n = level[i];
                next.push_back(n ? n->left : nullptr);
                next.push_back(n ? n->right : nullptr);
            }
            level = next;
        }
    }
};
