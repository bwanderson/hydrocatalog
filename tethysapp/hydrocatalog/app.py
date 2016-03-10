from tethys_sdk.base import TethysAppBase, url_map_maker


class HydroCatalog(TethysAppBase):
    """
    Tethys app class for Hydro Catalog.
    """

    name = 'Hydro Catalog'
    index = 'hydrocatalog:home'
    icon = 'hydrocatalog/images/icon.gif'
    package = 'hydrocatalog'
    root_url = 'hydrocatalog'
    color = '#f1c40f'
        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='hydrocatalog',
                           controller='hydrocatalog.controllers.home'),
        )

        return url_maps