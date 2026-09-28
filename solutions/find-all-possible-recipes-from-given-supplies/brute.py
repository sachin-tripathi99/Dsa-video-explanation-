class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        have = set(supplies)
        made = []
        changed = True
        while changed:                          # sweep until nothing new is made
            changed = False
            for r, need in zip(recipes, ingredients):
                if r not in have and all(x in have for x in need):
                    have.add(r)
                    made.append(r)
                    changed = True
        return made
