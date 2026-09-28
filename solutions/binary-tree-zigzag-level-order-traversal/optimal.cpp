class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> out;
        queue<TreeNode*> q;
        if (root) q.push(root);
        bool ltr = true;
        while (!q.empty()) {
            int size = q.size();
            vector<int> row(size);
            for (int i = 0; i < size; i++) {
                TreeNode* n = q.front(); q.pop();
                row[ltr ? i : size - 1 - i] = n->val;       // write in this level's direction
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
            out.push_back(row);
            ltr = !ltr;
        }
        return out;
    }
};
